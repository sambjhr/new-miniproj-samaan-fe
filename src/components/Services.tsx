import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Factory, Shield, Truck, Headphones } from "lucide-react";

const services = [
  {
    icon: Factory,
    title: "Production Excellence",
    description:
      "Delivering high-quality design and construction with precision and creativity.",
    gradient: "from-slate-600 to-slate-800",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description:
      "Ensuring every project meets the highest safety and design standards.",
    gradient: "from-slate-600 to-slate-800",
  },
  {
    icon: Truck,
    title: "Efficient Logistics",
    description:
      "Coordinating smooth project delivery and ensuring client satisfaction every time.",
    gradient: "from-slate-600 to-slate-800",
  },
  {
    icon: Headphones,
    title: "Client Support",
    description:
      "Providing continuous support and consultation from start to finish.",
    gradient: "from-slate-600 to-slate-800",
  },
];

function ServicesSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Our Services
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            We offer innovative architectural and design solutions that bring ideas to life.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-6 pt-8">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-linear-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 leading-tight">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-6 pb-8">
                  <p className="text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-20">
          <h3 className="text-3xl font-semibold text-slate-900 mb-8">
            What Our Clients Say
          </h3>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-slate-600 italic leading-relaxed mb-6">
              “Farhan Arsyad tm turned our vision into a stunning reality. Their
              creativity, professionalism, and attention to detail exceeded all
              expectations. Highly recommended!”
            </p>
            <p className="font-semibold text-slate-800">— Becca Bloom, Homeowner</p>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="text-center">
          <p className="text-xl font-medium text-slate-800">
            Pricing available upon request
          </p>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
