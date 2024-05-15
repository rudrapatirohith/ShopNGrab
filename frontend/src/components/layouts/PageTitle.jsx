import {Helmet} from "react-helmet"
 
const PageTitle = ({title}) => {
  return (
    <Helmet>
      <title>{`${title} - ShopNGrab`}</title>
    </Helmet>
  )
}

export default PageTitle
