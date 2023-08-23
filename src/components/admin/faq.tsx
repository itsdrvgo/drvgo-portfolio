"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/src/components/ui/accordion";
import { DefaultProps } from "@/src/types";

function FAQAccordian({ className }: DefaultProps) {
    return (
        <Accordion type="single" collapsible className={className}>
            <AccordionItem value="item-1">
                <AccordionTrigger>What is Blog Creation Tool?</AccordionTrigger>
                <AccordionContent>
                    Creating blogs have become easier, just click on the button,
                    and it will redirect you to the blogs page. Here will be a
                    list of all the blogs you have created till now. If you want
                    to create a new one, just click on, &lsquo;Create new
                    Blog&rsquo; and you will be able to create and post a new
                    one.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>
                    What is Course Creation Tool?
                </AccordionTrigger>
                <AccordionContent>
                    You do not ever have to go to other webites to enlist your
                    courses. Use this tool, to make a course within minutes and
                    host it in this website. People will be able to navigate and
                    apply to your courses.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>What is Users Panel?</AccordionTrigger>
                <AccordionContent>
                    It is very much important to keep track of your users. So,
                    we made it simpler by adding a dedicated panel to manage all
                    the signed-in users.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>What is Auto Post Tool?</AccordionTrigger>
                <AccordionContent>
                    Link your social accounts and create a post directly from
                    the panel. Once you hit the post button, the post will be
                    posted in all your linked profiles or pages, and will be
                    visible to everyone.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export default FAQAccordian;
