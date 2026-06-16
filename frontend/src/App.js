import 'bootstrap/dist/css/bootstrap.min.css';
import {PlatosProvider} from "./context/platosProvider";
import {AppRoutes} from "./routes";
import {BebidasProvider} from "./context/bebidasProvider";
import {ComandaProvider} from "./context/comandaProvider";

function App() {
  return (
    <PlatosProvider>
      <BebidasProvider>
        <ComandaProvider>
          <AppRoutes/>
        </ComandaProvider>
      </BebidasProvider>
    </PlatosProvider>
  );
}

export default App;
