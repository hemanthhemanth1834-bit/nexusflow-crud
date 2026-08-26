interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export default function LoadingSpinner({ message, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className={`${sizeMap[size]} relative`}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid rgba(255,255,255,0.06)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            border: '2px solid transparent',
            borderTopColor: '#00d4ff',
            borderRightColor: 'rgba(0, 212, 255, 0.4)',
          }}
        />
      </div>
      {message && (
        <p className="text-sm text-text-muted animate-pulse-glow">{message}</p>
      )}
    </div>
  )
}
