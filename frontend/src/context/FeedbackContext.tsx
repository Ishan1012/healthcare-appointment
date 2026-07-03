import { Testimonial } from "@/types/type";

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "John Doe",
        status: "Satisfied Patient",
        image: "/images/patient2.jpg",
        testimonial: "I had an amazing experience at WellNest. The staff was incredibly friendly and the doctors were very attentive to my needs. I highly recommend their services!",
        rating: 5,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
    },
    {
        id: 2,
        name: "Jane Smith",
        status: "Satisfied Patient",
        image: "/images/patient2.jpg",
        testimonial: "The care I received at WellNest was exceptional. The doctors took the time to explain everything and made me feel comfortable throughout my treatment.",
        rating: 4,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
    },
    {
        id: 3,
        name: "Emily Johnson",
        status: "Satisfied Patient",
        image: "/images/patient3.jpg",
        testimonial: "I appreciate the personalized care I received at WellNest. The team truly cares about their patients and it shows in their work.",
        rating: 5,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
    },
    {
        id: 4,
        name: "Michael Brown",
        status: "Satisfied Patient",
        image: "/images/patient2.jpg",
        testimonial: "WellNest has the best medical team! They are knowledgeable, caring, and always ready to help. I couldn't ask for a better healthcare experience.",
        rating: 4,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
    },
    {
        id: 5,
        name: "John Doe",
        status: "Satisfied Patient",
        image: "/images/patient1.jpg",
        testimonial: "I had an amazing experience at WellNest. The staff was incredibly friendly and the doctors were very attentive to my needs. I highly recommend their services!",
        rating: 5,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
    }
]

const getTestimonials = async (): Promise<Testimonial[]> => {
    return testimonials;
}

export default getTestimonials;