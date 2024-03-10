import { useDictionary } from '@/hooks/useDictionary';
import { Trigger as RadixTrigger } from '@radix-ui/react-dialog';
import {
  borders,
  colors,
  sizes,
} from '@/styles/global';
import { Person } from '@/types/data';
import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import styled from 'styled-components';
import { usePeople } from '../../hooks/people';
import useAuthPerson from '../../hooks/people/useAuthPerson';
import Button from '../Button/Button';
import Form from '../Form/Form';
import Input from '../Input/Input';
import Modal from '../Modal/Modal';
import Select from '../Select/Select';

const StyledTrigger = styled(RadixTrigger)`
    width: fit-content;
    background-color: ${colors.clickableBackground};
    padding: .5rem;
    border-radius: ${sizes.corner};
    border: ${borders.standard};
    cursor: pointer;
`;

type FormValues = Partial<Person>;

const Trigger = () => (<StyledTrigger>Uppdatera din profil</StyledTrigger>);

const Content = ({ onSuccess }: { onSuccess: () => void }) => {
  const [chosenProvince, setChosenProvince] = useState<Person['province'] | undefined>();
  const [chosenSociety, setChosenSociety] = useState<Person['society'] | undefined>();
  const { update } = usePeople();
  const { getDictionaryValue } = useDictionary();
  const { person } = useAuthPerson();
  const onSubmit: SubmitHandler<FormValues> = async ({
    name,
    family,
    age,
    pronouns,
  }) => {
    try {
      await update({
        person: {
          name,
          family,
          age,
          _id: person._id,
          society: chosenSociety,
          province: chosenProvince,
          pronouns: pronouns
            ? Array.from((pronouns as unknown as string)?.split(','))
            : undefined,
        },
      });

      onSuccess();
    } catch (error) {
      console.error('Failed to update profile');
    }
  };

  if (!person) {
    return null;
  }

  return (
    <Form onSubmit={onSubmit}>
      <Input
        required
        style={{ textTransform: 'capitalize' }}
        defaultValue={person?.name}
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
      <Input
        required
        style={{ textTransform: 'capitalize' }}
        defaultValue={person?.family}
        name="family"
        placeholder={getDictionaryValue(
          'common',
          'family',
        )}
        aria-label={getDictionaryValue(
          'common',
          'family',
        )}
      />
      <Input
        required
        type="number"
        defaultValue={person?.age}
        name="age"
        placeholder="Ålder"
        aria-label="Ålder"
      />
      {/* FIXME Should be array input */}
      <Input
        required
        style={{ textTransform: 'capitalize' }}
        defaultValue={person?.pronouns?.join(',')}
        name="pronouns"
        placeholder="Pronomen"
        aria-label="Pronomen"
      />
      <Select
        items={[
          {
            label: 'Imperiet',
            value: 'imperiet',
          },
          {
            label: 'Afrikanska Samväldet',
            value: 'afrikanska samväldet',
          },
          {
            label: 'Förenade Asien',
            value: 'förenade asien',
          },
          {
            label: 'Nya Amerika',
            value: 'nya amerika',
          },
        ]}
        defaultValue={person?.province}
        placeholder="Provins"
        onValueChange={(value) => setChosenProvince(value)}
      />
      <Select
        items={[
          {
            label: 'Bacchus',
            value: 'Bacchus',
          },
          {
            label: 'Pheme',
            value: 'Pheme',
          },
          {
            label: 'Bellona',
            value: 'Bellona',
          },
        ]}
        defaultValue={person?.society}
        placeholder="Elevhem"
        onValueChange={(value) => setChosenSociety(value)}
      />
      <Button type="submit">
        Uppdatera profil
      </Button>
    </Form>
  );
};

const EditProfile = () => {
  const [open, setOpen] = useState<boolean>();

  return (
    <Modal
      open={open}
      onOpenChange={(newOpen) => setOpen(newOpen)}
      trigger={<Trigger/>}
      title="Profil"
      content={<Content onSuccess={() => setOpen(false)}/>}
    />
  );
};

export default EditProfile;
