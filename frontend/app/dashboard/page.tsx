export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-zinc-800 p-6 rounded-xl">
          Revenue: $0
        </div>

        <div className="bg-zinc-800 p-6 rounded-xl">
          Sales: 0
        </div>

        <div className="bg-zinc-800 p-6 rounded-xl">
          Low Stock: 0
        </div>
      </div>
    </div>
  )
}