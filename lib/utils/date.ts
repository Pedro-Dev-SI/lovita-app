export function calculateTimeTogether(startDate: string) {
  // Garantir que a data seja interpretada como local, não UTC
  const [year, month, day] = startDate.split("-").map(Number)
  const start = new Date(year, month - 1, day)
  const now = new Date()

  const diffTime = Math.abs(now.getTime() - start.getTime())

  const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))
  const months = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
  const days = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diffTime % (1000 * 60)) / 1000)

  return { years, months, days, hours, minutes, seconds }
}

export function isAnniversary(startDate: string): "monthly" | "yearly" | null {
  const start = new Date(startDate)
  const now = new Date()

  // Check if it's yearly anniversary
  if (start.getDate() === now.getDate() && start.getMonth() === now.getMonth()) {
    return "yearly"
  }

  // Check if it's monthly anniversary
  if (start.getDate() === now.getDate()) {
    return "monthly"
  }

  return null
}
