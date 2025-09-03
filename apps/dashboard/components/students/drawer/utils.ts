export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Archived':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'Free-day':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Waiting':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
