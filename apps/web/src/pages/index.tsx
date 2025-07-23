import { Button } from "@/components/ui/button";

export default function IndexPage() {
    return (
        <div>
            <p>Yes, this is the index page!</p>
            <div>
                <p>click the following button to start</p>
                <Button variant={"outline"} onClick={() => {}}>
                    Start
                </Button>
            </div>
        </div>
    );
}
