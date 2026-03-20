import api from '@/lib/api';

export async function generateMetadata(props) {
  const params = await props.params;
  const id = params.id;
  try {
    const res = await api.get(`/events/${id}`);
    const event = res.data.data;
    return {
      title: `${event.title} | E-Cell IIIT Trichy`,
      description: event.description.substring(0, 160),
    };
  } catch (err) {
    return {
      title: "Event Details | E-Cell IIIT Trichy",
    };
  }
}

export default function EventDetailLayout({ children }) {
  return <>{children}</>;
}
