import { onBreadcrumbClick, setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { languageAtom } from "../store/store";
import { text } from "../language/text";
import { minSideUrl } from "../urls";

type Breadcrumb = {
  url: string;
  title: string;
  handleInApp: boolean;
};

const spraakTilpassetUrl = (url: string, language: string) => {
  if (language === "en") {
    return url + "/en";
  }
  if (language === "nn") {
    return url + "/nn";
  }
  return url;
};

const useBreadcrumbs = (breadcrumb?: Breadcrumb) => {
  const location = useLocation();
  const navigate = useNavigate();
  const language = useStore(languageAtom);

  onBreadcrumbClick((breadcrumb) => {
    navigate(breadcrumb.url);
  });

  useEffect(() => {
    const baseBreadcrumbs: Breadcrumb[] = [
      {
        url: spraakTilpassetUrl(minSideUrl, language),
        title: text.minSide[language],
        handleInApp: false,
      },
      {
        url: spraakTilpassetUrl("/dokumentarkiv", language),
        title: text.dokumentarkiv[language],
        handleInApp: true,
      },
    ];

    const breadcrumbs = breadcrumb ? baseBreadcrumbs.concat(breadcrumb) : baseBreadcrumbs;
    setBreadcrumbs(breadcrumbs);
  }, [location, breadcrumb, language]);
};

export default useBreadcrumbs;
