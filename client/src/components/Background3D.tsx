export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="absolute rounded-full blur-3xl animate-float"
        style={{
          width: '600px',
          height: '600px',
          top: '-10%',
          left: '-5%',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08), transparent 70%)',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl animate-float-delayed"
        style={{
          width: '500px',
          height: '500px',
          top: '20%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06), transparent 70%)',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl animate-float"
        style={{
          width: '450px',
          height: '450px',
          bottom: '5%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05), transparent 70%)',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl animate-float-delayed"
        style={{
          width: '350px',
          height: '350px',
          top: '50%',
          left: '10%',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.03), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
