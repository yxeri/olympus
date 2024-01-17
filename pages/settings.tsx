import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React from 'react';
import AdminSettings from '../components/AdminSettings/AdminSettings';
import Button from '../components/Button/Button';
import Container from '../components/Container/Container';
import EditFamilyProfile from '../components/EditFamilyProfile/EditFamilyProfile';
import EditProfile from '../components/EditProfile/EditProfile';
import ImageUploader from '../components/ImageUploader/ImageUploader';
import { useDictionary } from '../hooks/useDictionary';
import { colors } from '../styles/global';

export default function Settings() {
  const { getDictionaryValue } = useDictionary();
  const supabaseClient = useSupabaseClient();

  return (
    <div className="main-container">
      <Container style={{
        display: 'grid',
        gridGap: '1rem',
        backgroundColor: colors.componentBackground,
        padding: '1rem',
      }}
      >
        <h2>Inställningar & Profil</h2>
        <Button
          onClick={() => {
            supabaseClient.auth.signOut();
          }}
        >
          Logga ut
        </Button>
        <EditProfile />
        <EditFamilyProfile />
        <ImageUploader title={getDictionaryValue('settings', 'uploadPortrait')} maxFiles={1} />
        <AdminSettings />
      </Container>
    </div>
  );
}
