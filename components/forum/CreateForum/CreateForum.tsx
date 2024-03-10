import { useDictionary } from '@/hooks/useDictionary';
import { Trigger as RadixTrigger } from '@radix-ui/react-dialog';
import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import styled from 'styled-components';
import useForums from '../../../hooks/forums/useForums';
import AccessSelect from '../../AccessSelect/AccessSelect';
import Button from '../../Button/Button';
import Form from '../../Form/Form';
import Input from '../../Input/Input';
import Modal from '../../Modal/Modal';

const StyledTrigger = styled(RadixTrigger)``;

type FormValues = {
  name: string;
};

const Trigger = () => (<StyledTrigger>Create forum</StyledTrigger>);

const Content = ({ onSuccess }: { onSuccess: () => void }) => {
  const { insert } = useForums();
  const { getDictionaryValue } = useDictionary();
  const onSubmit: SubmitHandler<FormValues> = async ({ name }) => {
    try {
      await insert({ name });

      onSuccess();
    } catch (error) {
      console.error('Failed to create forum');
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Input
        required
        name="name"
        placeholder={getDictionaryValue(
          'common',
          'name',
        )}
        aria-label={getDictionaryValue(
          'common',
          'name',
        )}
      />
      <AccessSelect/>
      <Button type="submit">
        Create forum
      </Button>
    </Form>
  );
};

const CreateForum = () => {
  const [open, setOpen] = useState<boolean>();

  return (
    <Modal
      open={open}
      onOpenChange={(newOpen) => setOpen(newOpen)}
      trigger={<Trigger/>}
      title="Create forum"
      content={<Content onSuccess={() => setOpen(false)}/>}
    />
  );
};

export default CreateForum;
