'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import EventEditorForm from '@/components/admin/events/EventEditorForm';

export default function EditEventPage() {
  const params = useParams();
  
  return <EventEditorForm mode="edit" eventId={params.id} />;
}
