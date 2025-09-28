import { supabase } from '../lib/supabase';

export const userService = {
  // User Profile Management
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select(`
          *,
          emergency_contacts (
            id,
            name,
            phone,
            relationship,
            is_primary
          )
        `)?.eq('id', userId)?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateVolunteerStatus(userId, status) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update({ volunteer_status: status })?.eq('id', userId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateLocation(userId, latitude, longitude, address = null) {
    try {
      const updates = {
        location_latitude: latitude,
        location_longitude: longitude
      };

      if (address) {
        updates.address = address;
      }

      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Avatar Upload
  async uploadAvatar(userId, file) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase?.storage?.from('avatars')?.upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase?.storage?.from('avatars')?.getPublicUrl(filePath);

      // Update user profile with new avatar URL
      const { data, error } = await supabase?.from('user_profiles')?.update({ avatar_url: publicUrl })?.eq('id', userId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Statistics
  async getUserStats(userId, role) {
    try {
      let stats = {};

      if (role === 'victim') {
        // Get victim statistics
        const { data: alertStats, error: alertError } = await supabase?.from('emergency_alerts')?.select('status')?.eq('victim_id', userId);

        if (alertError) throw alertError;

        stats = {
          totalAlerts: alertStats?.length || 0,
          pendingAlerts: alertStats?.filter(a => a?.status === 'pending')?.length || 0,
          resolvedAlerts: alertStats?.filter(a => a?.status === 'resolved')?.length || 0,
          inProgressAlerts: alertStats?.filter(a => a?.status === 'in_progress')?.length || 0
        };
      } else if (role === 'volunteer') {
        // Get volunteer statistics
        const { data: responseStats, error: responseError } = await supabase?.from('alert_responses')?.select(`
            id,
            is_accepted,
            rating,
            alert:emergency_alerts!alert_id (status)
          `)?.eq('volunteer_id', userId);

        if (responseError) throw responseError;

        const acceptedResponses = responseStats?.filter(r => r?.is_accepted) || [];
        const completedResponses = acceptedResponses?.filter(r => 
          r?.alert?.status === 'resolved'
        ) || [];

        stats = {
          totalResponses: responseStats?.length || 0,
          acceptedResponses: acceptedResponses?.length || 0,
          completedResponses: completedResponses?.length || 0,
          averageRating: completedResponses?.length > 0 
            ? (completedResponses?.reduce((sum, r) => sum + (r?.rating || 0), 0) / 
               completedResponses?.filter(r => r?.rating)?.length) || 0
            : 0
        };
      }

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Available Volunteers
  async getAvailableVolunteers() {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select(`
          id,
          full_name,
          phone,
          location_latitude,
          location_longitude,
          address,
          skills,
          volunteer_status
        `)?.eq('role', 'volunteer')?.eq('is_active', true)?.order('full_name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

export default userService;