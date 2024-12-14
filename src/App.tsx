import Main from "./layout/Main";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ScrollToTop from "./utilities/ScrollToTop ";

const App = () => {
    return (
        <div>
            <ScrollToTop />
            <Main />
        </div>
    );
};

export default App;
