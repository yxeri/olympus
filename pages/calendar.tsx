const CalendarComponent = await import('components/Calendar/Calendar').then((mod) => mod.default);

export default function CalendarPage() {
  return (
    <div className="calendar-container">
      <CalendarComponent/>
    </div>
  );
}
