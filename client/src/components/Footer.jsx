export default function Footer() {
    return (
        <footer className="border-t py-6 md:py-0 bg-white">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built by{" "}
                    <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        Akash Dohare
                    </a>
                    .
                </p>
            </div>
        </footer>
    );
}
