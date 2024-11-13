import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={300}
    height={250}
    viewBox="0 0 300 250"
    backgroundColor="#8a8a8a"
    foregroundColor="#ebebeb"
    {...props}
  >
    <rect x="10" y="194" rx="3" ry="3" width="250" height="6" /> 
    <rect x="11" y="208" rx="3" ry="3" width="178" height="6" /> 
    <rect x="11" y="7" rx="0" ry="0" width="252" height="178" />
  </ContentLoader>
)

export default MyLoader