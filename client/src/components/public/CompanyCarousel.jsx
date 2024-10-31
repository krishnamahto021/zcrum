import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const CompanyCarousel = () => {
  const companies = [
    {
      name: "amazon",
      path: "https://krishnabucket021.s3.ap-southeast-2.amazonaws.com/zcrum/amazon.svg",
      id: 1,
    },
    {
      name: "atlassian",
      path: "https://krishnabucket021.s3.ap-southeast-2.amazonaws.com/zcrum/atlassian.svg",
      id: 2,
    },
    {
      name: "google",
      path: "https://krishnabucket021.s3.ap-southeast-2.amazonaws.com/zcrum/google.webp",
      id: 3,
    },
    {
      name: "ibm",
      path: "https://krishnabucket021.s3.ap-southeast-2.amazonaws.com/zcrum/ibm.svg",
      id: 4,
    },
    {
      name: "meta",
      path: "https://krishnabucket021.s3.ap-southeast-2.amazonaws.com/zcrum/meta.svg",
      id: 5,
    },
    {
      name: "microsoft",
      path: "https://krishnabucket021.s3.ap-southeast-2.amazonaws.com/zcrum/microsoft.webp",
      id: 6,
    },
    {
      name: "netflix",
      path: "https://krishnabucket021.s3.ap-southeast-2.amazonaws.com/zcrum/netflix.png",
      id: 7,
    },
    {
      name: "uber",
      path: "https://krishnabucket021.s3.ap-southeast-2.amazonaws.com/zcrum/uber.svg",
      id: 8,
    },
  ];

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2500,
        }),
      ]}
      className="w-full py-10"
    >
      <CarouselContent className="flex gap-5 sm:gap-20 items-center">
        {companies.map((c, index) => (
          <CarouselItem key={index} className="basis-1/3 lg:basis-1/6">
            <img
              src={c.path}
              alt={c.name}
              width={200}
              height={56}
              className="h-9 sm:h-14 w-auto object-contain"
            ></img>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CompanyCarousel;
