import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { hotelInfo } from '@/data/mockData';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    content: hotelInfo.address,
  },
  {
    icon: Phone,
    title: 'Phone',
    content: hotelInfo.phone,
  },
  {
    icon: Mail,
    title: 'Email',
    content: hotelInfo.email,
  },
  {
    icon: Clock,
    title: 'Hours',
    content: 'Reception: 24/7',
  },
];

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      {/* Header */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy/80 z-10" />
            <img
              src="https://plus.unsplash.com/premium_photo-1682125235036-d1ab54136ff4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29udGFjdCUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D"
              alt="Contact Support"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="container-hotel relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="inline-block text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-6 px-4 py-1 border border-gold/30 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Get In Touch
            </motion.span>

            <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
              We're Here to <span className="text-gold italic">Help</span>
            </h1>

            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Have questions about your spiritual journey or need assistance?
              Our team at Shri Balaji Home Stay is always ready to assist you.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent opacity-50" />
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-hotel">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h2 className="heading-section text-foreground mb-6">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-8">
                We'd love to hear from you. Whether you have questions about temple timings,
                local transportation, or need assistance with your spiritual journey in Ujjain,
                our team is ready to help with traditional hospitality.
              </p>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Check-in/out Times */}
              <div className="mt-8 p-6 bg-muted rounded-xl">
                <h3 className="font-semibold text-foreground mb-4">Check-in & Check-out</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="font-medium">{hotelInfo.checkInTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Check-out</span>
                    <span className="font-medium">{hotelInfo.checkOutTime}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-card rounded-xl border border-border p-8">
                <h3 className="text-xl font-serif font-semibold text-foreground mb-6">
                  Send us a Message
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Your Name"
                      placeholder="John Doe"
                      error={errors.name?.message}
                      {...register('name')}
                      required
                    />
                    <FormInput
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                      error={errors.email?.message}
                      {...register('email')}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                    <FormInput
                      label="Subject"
                      placeholder="Reservation inquiry"
                      error={errors.subject?.message}
                      {...register('subject')}
                      required
                    />
                  </div>

                  <FormTextarea
                    label="Your Message"
                    placeholder="Tell us about your inquiry..."
                    error={errors.message?.message}
                    {...register('message')}
                    required
                    rows={5}
                  />

                  <Button
                    type="submit"
                    variant="hotel"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-96 bg-muted">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gold mx-auto mb-4" />
            <p className="text-muted-foreground">
              Interactive map would be displayed here
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
