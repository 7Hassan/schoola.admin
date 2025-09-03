// Receives a combined name: "childName / parentName"
export function StudentAvatar({ name }: { name: string }) {
  return (
    <div
      className="flex items-center justify-center bg-blue-100 text-blue-700 font-semibold rounded-full"
      style={{ width: 48, height: 48, minWidth: 48, minHeight: 48 }}
    >
      {name
        .split(/[ /]+/)
        .map((n) => n[0])
        .join('')
        .toUpperCase()}
    </div>
  )
}
