"use client";

import { DefaultProps } from "@/src/types";
import { Accordion, AccordionItem } from "@nextui-org/react";

interface FAQs {
    question: string;
    answer: string;
}

const faqs: FAQs[] = [
    {
        question: "What is Blog Creation Tool?",
        answer: "Creating blogs have become easier, just click on the button, and it will redirect you to the blogs page. Here will be a list of all the blogs you have created till now. If you want to create a new one, just click on, 'Create new Blog' and you will be able to create and post a new one.",
    },
    {
        question: "What is Course Creation Tool?",
        answer: "You do not ever have to go to other webites to enlist your courses. Use this tool, to make a course within minutes and host it in this website. People will be able to navigate and apply to your courses.",
    },
    {
        question: "What is Users Panel?",
        answer: "It is very much important to keep track of your users. So, we made it simpler by adding a dedicated panel to manage all the signed-in users.",
    },
    {
        question: "What is Auto Post Tool?",
        answer: "Link your social accounts and create a post directly from the panel. Once you hit the post button, the post will be posted in all your linked profiles or pages, and will be visible to everyone.",
    },
];

function FAQAccordian({ className }: DefaultProps) {
    return (
        <Accordion variant="light">
            {faqs.map((faq, index) => (
                <AccordionItem
                    key={index}
                    aria-label={faq.question}
                    title={faq.question}
                >
                    {faq.answer}
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export default FAQAccordian;
