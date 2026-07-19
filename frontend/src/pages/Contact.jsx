import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { Helmet } from '../components/common/Helmet';
import Button from '../components/common/Button';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async () => {
    // No dedicated backend endpoint for contact form submissions yet —
    // this simulates a successful send. Wire up a /api/contact route
    // and nodemailer call in the backend to make this fully functional.
    await new Promise((r) => setTimeout(r, 600));
    toast.success('Message sent! We will get back to you within 24 hours.');
    reset();
  };

  return (
    <div className="container-custom py-16">
      <Helmet title="Contact Us | Shreedha Vastra" />
      <h1 className="font-serif text-4xl mb-10 text-center">Get in Touch</h1>

      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <FiMapPin className="text-gold mt-1" size={20} />
            <p>Shreedha Vastra<br />Ghaziabad,Uttar Pradesh,India</p>
          </div>
          {/* <div className="flex gap-4 items-start">
            <FiPhone className="text-gold mt-1" size={20} />
            <p></p>
          </div> */}
          <div className="flex gap-4 items-start">
            <FiMail className="text-gold mt-1" size={20} />
            <p>shreedhavastra19@gmail.com</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input placeholder="Your Name" className="input-field" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input type="email" placeholder="Your Email" className="input-field" {...register('email', { required: 'Email is required' })} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <textarea rows={5} placeholder="Your Message" className="input-field" {...register('message', { required: 'Message is required' })} />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
          </div>
          <Button type="submit" isLoading={isSubmitting} className="w-full">Send Message</Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
