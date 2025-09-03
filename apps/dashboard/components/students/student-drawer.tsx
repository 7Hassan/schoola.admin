"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader } from '@workspace/ui/components/ui/sheet'
import { Separator } from '@workspace/ui/components/ui/separator'
import { Student, useStudentsStore } from '@/stores/students-store'
import { studentSchema, StudentFormData, getDefaultFormValues } from './drawer/validation'
import { getStatusColor } from './drawer/utils'
import { normalizeStudentGroup } from './drawer/group-utils'

import { StudentDrawerHeader } from './drawer/header'
import { BasicInfo } from './drawer/basic-info'
import { ContactInfo } from './drawer/contact-info'
import { AcademicInfo } from './drawer/academic-info'
import { AdditionalInfo } from './drawer/additional-info'
import { SystemInfo } from './drawer/system-info'
import { Actions } from './drawer/actions'


export function StudentDrawer() {
  const {
    selectedStudent,
    isDrawerOpen,
    isAddMode,
    setDrawerOpen,
    setSelectedStudent,
    addStudent,
    updateStudent,
    deleteStudents,
    closeDrawer,
    studyGroups,
    userRole
  } = useStudentsStore()

  const [originalData, setOriginalData] = useState<Student | null>(null)
  const canEdit = userRole === 'admin' || userRole === 'super-admin'

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty }
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema)
  })

  const watchedValues = watch()

  // Helper function to get default form values for add mode
  // (imported from validation.ts)

  useEffect(() => {
    if (isAddMode) {
      // Add mode - reset with default values
      const defaultValues = getDefaultFormValues()
      setOriginalData(null)
      reset(defaultValues)
    } else if (selectedStudent) {
      // Edit mode - reset with student data
      setOriginalData(selectedStudent)
      reset({
        childName: selectedStudent.childName,
        parentName: selectedStudent.parentName,
        parentPhone: selectedStudent.parentPhone,
        age: selectedStudent.age,
        email: selectedStudent.email,
        source: selectedStudent.source,
        paid: selectedStudent.paid,
        status: selectedStudent.status,
        group: selectedStudent.group,
        info: selectedStudent.info
      })
    }
  }, [selectedStudent, isAddMode])


  function onSubmit(data: StudentFormData) {
    if (!canEdit) return;
    if (isAddMode) {
      // Add new student - ensure group is normalized
      const payload = { ...data, group: normalizeStudentGroup(data.group), code: `STU-${Date.now()}` };
      addStudent(payload as any);
    } else if (selectedStudent) {
      // Update existing student
      updateStudent(selectedStudent.id, { ...data, group: normalizeStudentGroup(data.group) });
    }
    closeDrawer();
  }

  function handleClose() {
    closeDrawer();
    setOriginalData(null);
  }

  function resetField(fieldName: keyof StudentFormData) {
    if (isAddMode) {
      // In add mode, reset to default values
      const defaultValues = getDefaultFormValues();
      setValue(fieldName, defaultValues[fieldName] as any);
    } else if (originalData) {
      // In edit mode, reset to original data
      setValue(fieldName, originalData[fieldName] as any);
    }
  }

  const title = isAddMode
    ? 'Add Student'
    : selectedStudent
      ? `${selectedStudent.childName}${selectedStudent.parentName ? ' / ' + selectedStudent.parentName : ''}`
      : 'Edit Student'
  const description = isAddMode ? 'Create a new student record' : 'Edit student details'


  return (
    <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6">
          <StudentDrawerHeader isAddMode={isAddMode} title={title} description={description} selectedStudent={selectedStudent} getStatusColor={getStatusColor} />
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfo register={register} errors={errors} watchedValues={watchedValues} resetField={resetField} isAddMode={isAddMode} originalData={originalData} canEdit={canEdit} />

          <Separator />

          <ContactInfo register={register} errors={errors} watchedValues={watchedValues} resetField={resetField} setValue={setValue as any} isAddMode={isAddMode} originalData={originalData} canEdit={canEdit} />

          <Separator />

          <AcademicInfo register={register} errors={errors} watchedValues={watchedValues} resetField={resetField} setValue={setValue as any} isAddMode={isAddMode} originalData={originalData} canEdit={canEdit} studyGroups={studyGroups} />

          <Separator />

          <AdditionalInfo register={register} errors={errors} canEdit={canEdit} />

          <Separator />

          {!isAddMode && selectedStudent && (
            <SystemInfo selectedStudent={selectedStudent} />
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Actions onCancel={handleClose} onSave={() => handleSubmit(onSubmit)()} onDelete={() => {
              if (!selectedStudent) return
              deleteStudents([selectedStudent.id])
              handleClose()
            }} canEdit={canEdit} isAddMode={isAddMode} isDirty={isDirty} />
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
