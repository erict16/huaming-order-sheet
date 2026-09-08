import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HomeIntro from "@/components/HomeIntro";
import OrderForm from "@/components/OrderForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pb-12">
        <HomeIntro />
        <OrderForm />
      </main>
      <Footer />
    </div>
  );
}
