"use client";

import { DefaultProps } from "@/src/types";
import { Accordion, AccordionItem } from "@nextui-org/react";

interface FAQs {
    question: string;
    answer: string;
}

const faqs: FAQs[] = [
    {
        question: "What are blogs?",
        answer: "Blogs are a type of regularly updated websites that provide insight into a certain topic. The word blog is a combined version of the words 'web' and 'log'. At their inception, blogs were simply an online diary where people could keep a log about their daily lives on the web. They have since morphed into an essential forum for individuals and businesses alike to share information and updates.",
    },
    {
        question: "How can I write a blog using this tool?",
        answer: "if you do not have any blogs yet, click on the button that says 'New Blog'. This will redirect you to your first blog. You can set the title, thumbnail and the content of the blog. The blog content must be written in general markdown syntax.",
    },
    {
        question: "Can I get a preview of what I just wrote in the blog?",
        answer: "Yes, there is a dedicated button on the right side of your screen. Toggling this will change the view mode of your current blog.",
    },
    {
        question: "How can I publish the blog?",
        answer: "Before publishing the blog, you must save it as draft. A publishable blog must contain all three of a title, description and thumbnail. If a blog misses any of these, that will become unpublishable. Click on the three dots of the blog, that you want to publish, and click on 'Publish'.",
    },
    {
        question: "Can I unpublish the blog?",
        answer: "Yes, for this you have to click on the three dots again, and click on 'Unpublish'.",
    },
    {
        question: "Can I edit a blog?",
        answer: "Yes, you can edit a blog even after publishing it. For this you have to click on the three dots, and click on 'Edit'.",
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
