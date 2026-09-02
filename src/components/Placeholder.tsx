export default function Placeholder({ titre }: { titre: string }) {
  return (
    <div>
      <h2 className="text-2xl">{titre}</h2>
      <p className="mt-2 text-sm">Cette page arrive dans une prochaine étape.</p>
    </div>
  )
}
