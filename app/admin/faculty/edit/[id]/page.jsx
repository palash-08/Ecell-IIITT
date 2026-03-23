'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import FacultyEditorForm from '@/components/admin/faculty/FacultyEditorForm';

export default function EditFacultyPage() {
  const params = useParams();
  
  return <FacultyEditorForm mode="edit" facultyId={params.id} />;
}
