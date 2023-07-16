import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Provider } from '@supabase/gotrue-js';
import React, { ReactNode } from 'react';
import Button from '../Button/Button';

type OAuthButtonProps = {
  content: ReactNode,
  provider: Provider
};

const OAuthButton: React.FC<OAuthButtonProps> = ({ content, provider }) => {
  const supabaseClient = useSupabaseClient();

  return (
    <Button
      type="button"
      onClick={() => supabaseClient.auth.signInWithOAuth({ provider })}
    >
      {content}
    </Button>
  );
};

export default OAuthButton;
