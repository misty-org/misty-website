import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { pricingFaqs } from "../data";

export default function PricingFaq() {
  return (
    <div>
      <h2 className="mb-6 marketing-heading text-foreground">
        Questions and answers
      </h2>
      <Accordion type="multiple">
        {pricingFaqs.map((faq) => (
          <AccordionItem key={faq.q} value={faq.q} className="not-last:border-b-0">
            <AccordionTrigger className="py-4 text-foreground hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
