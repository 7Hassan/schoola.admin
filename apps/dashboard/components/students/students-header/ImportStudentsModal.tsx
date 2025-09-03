import React, { useRef, useState } from 'react';
import { Button } from '@workspace/ui/components/ui/button';
import { validateStudentBasicInfo } from '../validation/student-basic-validation';

interface StudentRow {
  [key: string]: string;
}

interface ImportStudentsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (validStudents: StudentRow[], invalidStudents: StudentRow[]) => void;
}

function parseCSV(text: string): StudentRow[] {
  const lines = text?.trim().split(/\r?\n/) || [];
  if (lines.length < 2) return [];
  const headers = (lines[0] || '').split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row: StudentRow = {};
    headers.forEach((header, i) => {
      row[header] = values[i]?.trim() || '';
    });
    return row;
  });
}

function getMissingFields(row: StudentRow): string[] {
  // Map CSV fields to StudentBasicInfo
  const info = {
    childName: row.childName,
    parentName: row.parentName,
    age: row.age,
    parentPhone: row.parentPhone,
    group: row.group
  };
  return validateStudentBasicInfo(info).missingFields;
}

export function ImportStudentsModal({ open, onClose, onSave }: ImportStudentsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [invalidStudents, setInvalidStudents] = useState<StudentRow[]>([]);
  const [validStudents, setValidStudents] = useState<StudentRow[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [step, setStep] = useState<'upload' | 'review'>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length === 0) return;
      // Always expect these fields for students
      const fields = ['childName', 'parentName', 'age', 'parentPhone', 'group'];
      setRequiredFields(fields);
      const invalid: StudentRow[] = [];
      const valid: StudentRow[] = [];
      rows.forEach(row => {
        const missingFields = getMissingFields(row);
        if (missingFields.length > 0) {
          invalid.push({ ...row, missingFields: missingFields.join(', ') });
        } else {
          valid.push(row);
        }
      });
      setStudents(rows);
      setInvalidStudents(invalid);
      setValidStudents(valid);
      setStep('review');
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    onSave(validStudents, invalidStudents);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Import Students from Excel (CSV)</h2>
        {step === 'upload' && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="mb-4"
              onChange={handleFileChange}
            />
            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </>
        )}
        {step === 'review' && (
          <>
            <div className="mb-4">
              <p className="mb-2">Valid Students: <span className="font-semibold">{validStudents.length}</span></p>
              <p className="mb-2">Students with Missing Data: <span className="font-semibold text-red-600">{invalidStudents.length}</span></p>
            </div>
            {invalidStudents.length > 0 && (
              <div className="mb-4 max-h-40 overflow-auto border border-red-200 rounded">
                <p className="text-red-600 font-semibold mb-2">Students with missing data:</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      {requiredFields.map(field => <th key={field} className="px-2 py-1 border-b">{field}</th>)}
                      <th className="px-2 py-1 border-b">Missing Fields</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invalidStudents.map((row, i) => (
                      <tr key={i} className="bg-red-50">
                        {requiredFields.map(field => <td key={field} className="px-2 py-1">{row[field]}</td>)}
                        <td className="px-2 py-1 text-red-600 font-semibold">
                          {row.missingFields || ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} disabled={validStudents.length === 0}>Save Valid Students</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
