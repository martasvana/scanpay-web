import Image from "next/image";

interface TestimonialProps {
  name?: string;
  title?: string;
  imgSrc?: string;
}

export const Testimonial = ({ 
  name = "Leonid Bugaev", 
  title = "Founder of Goreplay", 
  imgSrc = "/images/testimonials/leonid-bugaev.jpg" 
}: TestimonialProps) => {
  return (
    <div className="bg-white p-12 rounded-3xl h-full flex flex-col justify-center max-w-xl shadow-sm">
      <div className="mb-8 text-purple-100">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.352 4C4.456 7.456 1.646 13.825 1.646 21.002h5.56c0-5.556 2.03-8.58 4.243-10.32v-6.68h-2.1zm13.37 0c-4.895 3.456-7.706 9.825-7.706 17.002h5.56c0-5.556 2.03-8.58 4.243-10.32v-6.68h-2.1z" />
        </svg>
      </div>
      
      <div className="flex items-center mb-10">
        <div className="mr-4 relative rounded-full overflow-hidden w-14 h-14 border-2 border-white">
        <img src="https://pbs.twimg.com/profile_images/1908887041556762624/eQfG6zfP_400x400.png" alt="User" className="w-14 h-14 rounded-full border-2 border-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-xl">{name}</p>
          <p className="text-gray-600">{title}</p>
        </div>
      </div>
      
      <p className="text-xl text-gray-700 mb-6 leading-relaxed">
        I'm quite <span className="font-bold text-gray-900">amazed by the quality</span> of Unrenewed for programmatic blog content generation.
      </p>
      
      <p className="text-xl text-gray-700 leading-relaxed">
        It is the first time I don't feel ashamed to post AI content as it is, and I genuinely can't wait until the next day to check the Unrenewed dashboard and see what it has generated for me!
      </p>
    </div>
  );
}; 