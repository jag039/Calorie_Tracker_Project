import FoodSearch from "@/pages/foodSearch";
import Info from "@/pages/Info";
import Log from "@/pages/Log";

export default function Layout() {
  return (
    <div>
      <div className="">
        <div>DATE</div>
        <div><button>Open Search</button></div>
      </div>
      <div className="flex flex-row">
        <div className="grow h-screen">
        <Info limit={500} img="none" eaten={200}/>
        </div>
        <div className="grow h-screen">
          <Log/>
        </div>
        <div className="">
          <FoodSearch/>
        </div>
      </div>
    </div>
  );
}
