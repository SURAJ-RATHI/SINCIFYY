export default function ScreenLoading({ content }: { content?: string }) {
    return (
        <div className="Loading h-dvh w-full flex items-center justify-center font-sincifyfont bg-island-bg-color text-loading-text-color text-xl tracking-wide">
            {content ? `${content}` : 'Loading ...'}
        </div>
    )
}