import { supabase } from '../lib/supabase';

export const emergencyService = {
  // Emergency Alerts
  async createAlert(alertData) {
    try {
      const { data, error } = await supabase?.from('emergency_alerts')?.insert({
          victim_id: alertData?.victimId,
          emergency_type: alertData?.emergencyType,
          title: alertData?.title,
          description: alertData?.description,
          latitude: alertData?.latitude,
          longitude: alertData?.longitude,
          address: alertData?.address,
          priority_level: alertData?.priorityLevel || 3
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUserAlerts(userId, options = {}) {
    try {
      let query = supabase?.from('emergency_alerts')?.select(`
          *,
          alert_responses (
            id,
            volunteer_id,
            response_time,
            estimated_arrival,
            message,
            is_accepted,
            arrival_time,
            completion_time,
            rating,
            feedback,
            volunteer:user_profiles!volunteer_id (
              id,
              full_name,
              phone,
              avatar_url
            )
          )
        `)?.eq('victim_id', userId)?.order('created_at', { ascending: false });

      if (options?.status) {
        query = query?.eq('status', options?.status);
      }

      if (options?.limit) {
        query = query?.limit(options?.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getActiveAlerts(location = null, radiusKm = 10) {
    try {
      let query = supabase?.from('emergency_alerts')?.select(`
          *,
          victim:user_profiles!victim_id (
            id,
            full_name,
            phone,
            avatar_url
          ),
          alert_responses (
            id,
            volunteer_id,
            is_accepted
          )
        `)?.in('status', ['pending', 'acknowledged', 'in_progress'])?.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateAlertStatus(alertId, status, updates = {}) {
    try {
      const updateData = { 
        status,
        ...updates,
        ...(status === 'resolved' && { resolved_at: new Date()?.toISOString() })
      };

      const { data, error } = await supabase?.from('emergency_alerts')?.update(updateData)?.eq('id', alertId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Alert Responses
  async respondToAlert(responseData) {
    try {
      const { data, error } = await supabase?.from('alert_responses')?.insert({
          alert_id: responseData?.alertId,
          volunteer_id: responseData?.volunteerId,
          estimated_arrival: responseData?.estimatedArrival,
          message: responseData?.message,
          is_accepted: responseData?.isAccepted || false
        })?.select()?.single();

      if (error) throw error;

      // Update alert status if accepted
      if (responseData?.isAccepted) {
        await this.updateAlertStatus(responseData?.alertId, 'acknowledged');
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getVolunteerResponses(volunteerId, options = {}) {
    try {
      let query = supabase?.from('alert_responses')?.select(`
          *,
          alert:emergency_alerts!alert_id (
            id,
            title,
            emergency_type,
            address,
            status,
            created_at,
            victim:user_profiles!victim_id (
              full_name,
              phone
            )
          )
        `)?.eq('volunteer_id', volunteerId)?.order('response_time', { ascending: false });

      if (options?.limit) {
        query = query?.limit(options?.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateResponse(responseId, updates) {
    try {
      const { data, error } = await supabase?.from('alert_responses')?.update(updates)?.eq('id', responseId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Nearby Volunteers
  async getNearbyVolunteers(latitude, longitude, radiusMeters = 5000) {
    try {
      const { data, error } = await supabase?.rpc('get_nearby_volunteers', {
          alert_lat: latitude,
          alert_lng: longitude,
          radius_meters: radiusMeters
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Emergency Contacts
  async getEmergencyContacts(userId) {
    try {
      const { data, error } = await supabase?.from('emergency_contacts')?.select('*')?.eq('user_id', userId)?.order('is_primary', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async addEmergencyContact(contactData) {
    try {
      const { data, error } = await supabase?.from('emergency_contacts')?.insert({
          user_id: contactData?.userId,
          name: contactData?.name,
          phone: contactData?.phone,
          relationship: contactData?.relationship,
          is_primary: contactData?.isPrimary || false
        })?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateEmergencyContact(contactId, updates) {
    try {
      const { data, error } = await supabase?.from('emergency_contacts')?.update(updates)?.eq('id', contactId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteEmergencyContact(contactId) {
    try {
      const { error } = await supabase?.from('emergency_contacts')?.delete()?.eq('id', contactId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Real-time subscriptions
  subscribeToAlerts(callback, userId = null) {
    const channelName = userId ? `user-alerts-${userId}` : 'all-alerts';
    
    let subscription = supabase?.channel(channelName)?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'emergency_alerts',
          ...(userId && { filter: `victim_id=eq.${userId}` })
        },
        callback
      );

    return subscription?.subscribe();
  },

  subscribeToResponses(alertId, callback) {
    return supabase?.channel(`alert-responses-${alertId}`)?.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'alert_responses',
          filter: `alert_id=eq.${alertId}`
        },
        callback
      )?.subscribe();
  }
};

export default emergencyService;