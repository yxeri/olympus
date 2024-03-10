import { sizes } from '@/styles/global';
import { SubmitHandler } from 'react-hook-form';
import EditPersonScoreList from '../../components/EditPersonScoreList/EditPersonScoreList';
import Filter from '../../components/Filter/Filter';
import Form from '../../components/Form/Form';
import SaveButton from '../../components/SaveButton/SaveButton';
import { usePeople } from '../../hooks/people';
import useAuthPerson from '../../hooks/people/useAuthPerson';

export default function EditScorePage() {
  const { update } = usePeople();
  const { person } = useAuthPerson();
  const onSubmit: SubmitHandler<any> = async (data) => {
    const changed = Object.entries(data)
      .filter(([, value]) => !Number.isNaN(value));

    await update({
      people: changed.map(([id, value]) => ({
        _id: id,
        scoreChanges: [
          {
            userId: person._id,
            amount: value as number,
          },
        ],
      })),
    });

    console.log(data);
  };

  return (
    <div className="main-container" style={{ maxWidth: sizes.mediumMax }}>
      <Filter showSwitch={false}/>
      <Form onSubmit={onSubmit}>
        <EditPersonScoreList/>
        <SaveButton/>
      </Form>
    </div>
  );
}
