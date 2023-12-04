import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import styled from 'styled-components';
import { Trigger as RadixTrigger } from '@radix-ui/react-dialog';
import useFamilies from '../../hooks/families/useFamilies';
import useAuthPerson from '../../hooks/people/useAuthPerson';
import {
  borders,
  colors,
  sizes,
} from '../../styles/global';
import {
  Family,
} from '../../types/data';
import Button from '../Button/Button';
import Form from '../Form/Form';
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

type FormValues = Partial<Family>;

const Trigger = () => (<StyledTrigger>Uppdatera din familjs profil</StyledTrigger>);

const Content = ({ onSuccess }: { onSuccess: () => void }) => {
  const [chosenProvince, setChosenProvince] = useState<Family['province'] | undefined>();
  const { update, families } = useFamilies();
  const { person } = useAuthPerson();

  const family = families.find((fam) => fam.name === person?.family);

  const onSubmit: SubmitHandler<FormValues> = async () => {
    try {
      await update({
        family: {
          name: family?.name ?? person?.family,
          _id: family?._id,
          province: chosenProvince,
        },
      });

      onSuccess();
    } catch (error) {
      console.error('Failed to update family');
    }
  };

  if (!person) {
    return null;
  }

  return (
    <Form onSubmit={onSubmit}>
      <Select
        items={[
          { label: 'Imperiet', value: 'imperiet' },
          { label: 'Afrikanska Samväldet', value: 'afrikanska samväldet' },
          { label: 'Förenade Asien', value: 'förenade asien' },
          { label: 'Nya Amerika', value: 'nya amerika' },
        ]}
        defaultValue={family?.province}
        placeholder="Provins"
        onValueChange={(value) => setChosenProvince(value)}
      />
      <Button type="submit">
        Uppdatera familjens profil
      </Button>
    </Form>
  );
};

const EditFamilyProfile = () => {
  const [open, setOpen] = useState<boolean>();

  return (
    <Modal
      open={open}
      onOpenChange={(newOpen) => setOpen(newOpen)}
      trigger={<Trigger />}
      title="Profil"
      content={<Content onSuccess={() => setOpen(false)} />}
    />
  );
};

export default EditFamilyProfile;
