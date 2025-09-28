import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const EmergencyContactsSection = ({ contacts = [], onSave = () => {} }) => {
  const [contactList, setContactList] = useState(contacts);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const relationshipOptions = [
    { value: 'spouse', label: 'Spouse/Partner' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'neighbor', label: 'Neighbor' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'other', label: 'Other' }
  ];

  const addContact = () => {
    const newContact = {
      id: Date.now(),
      name: '',
      relationship: '',
      phone: '',
      isPrimary: contactList?.length === 0
    };
    setContactList(prev => [...prev, newContact]);
  };

  const removeContact = (id) => {
    setContactList(prev => {
      const updated = prev?.filter(contact => contact?.id !== id);
      // If we removed the primary contact, make the first one primary
      if (updated?.length > 0 && !updated?.some(c => c?.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const updateContact = (id, field, value) => {
    setContactList(prev => prev?.map(contact => 
      contact?.id === id 
        ? { ...contact, [field]: value }
        : contact
    ));

    // Clear error when user starts typing
    const errorKey = `${id}_${field}`;
    if (errors?.[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const setPrimaryContact = (id) => {
    setContactList(prev => prev?.map(contact => ({
      ...contact,
      isPrimary: contact?.id === id
    })));
  };

  const validateContacts = () => {
    const newErrors = {};

    contactList?.forEach(contact => {
      if (!contact?.name?.trim()) {
        newErrors[`${contact.id}_name`] = 'Name is required';
      }

      if (!contact?.relationship) {
        newErrors[`${contact.id}_relationship`] = 'Relationship is required';
      }

      if (!contact?.phone?.trim()) {
        newErrors[`${contact.id}_phone`] = 'Phone number is required';
      } else if (!/^\+?[\d\s\-\(\)]{10,}$/?.test(contact?.phone)) {
        newErrors[`${contact.id}_phone`] = 'Please enter a valid phone number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateContacts()) return;

    setIsSaving(true);
    try {
      await onSave(contactList);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save emergency contacts:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContactList(contacts);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Icon name="Phone" size={20} className="text-primary mr-2" />
          <h2 className="text-lg font-semibold text-foreground">
            Emergency Contacts
          </h2>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            iconName="Edit"
            iconPosition="left"
            iconSize={16}
          >
            Edit
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {contactList?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="UserPlus" size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No emergency contacts added yet</p>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={addContact}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
                className="mt-3"
              >
                Add First Contact
              </Button>
            )}
          </div>
        ) : (
          contactList?.map((contact, index) => (
            <div key={contact?.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-foreground">
                    Contact {index + 1}
                  </span>
                  {contact?.isPrimary && (
                    <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                {isEditing && contactList?.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContact(contact?.id)}
                    iconName="Trash2"
                    iconSize={16}
                    className="text-destructive hover:text-destructive"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={contact?.name}
                  onChange={(e) => updateContact(contact?.id, 'name', e?.target?.value)}
                  error={errors?.[`${contact?.id}_name`]}
                  disabled={!isEditing}
                  required
                  placeholder="Contact name"
                />

                <Select
                  label="Relationship"
                  options={relationshipOptions}
                  value={contact?.relationship}
                  onChange={(value) => updateContact(contact?.id, 'relationship', value)}
                  error={errors?.[`${contact?.id}_relationship`]}
                  disabled={!isEditing}
                  required
                  placeholder="Select relationship"
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={contact?.phone}
                  onChange={(e) => updateContact(contact?.id, 'phone', e?.target?.value)}
                  error={errors?.[`${contact?.id}_phone`]}
                  disabled={!isEditing}
                  required
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {isEditing && !contact?.isPrimary && contactList?.length > 1 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPrimaryContact(contact?.id)}
                    iconName="Star"
                    iconPosition="left"
                    iconSize={14}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Set as Primary
                  </Button>
                </div>
              )}
            </div>
          ))
        )}

        {isEditing && contactList?.length > 0 && contactList?.length < 5 && (
          <Button
            variant="outline"
            onClick={addContact}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            fullWidth
          >
            Add Another Contact
          </Button>
        )}

        {isEditing && (
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
            >
              Save Contacts
            </Button>
          </div>
        )}
      </div>
      {!isEditing && contactList?.length === 0 && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
          >
            Add Emergency Contacts
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmergencyContactsSection;