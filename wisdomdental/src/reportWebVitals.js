//function to measure and report web performance metrics
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry); //CLS: Cumulative Layout Shift
      getFID(onPerfEntry); //FID: First Input Delay
      getFCP(onPerfEntry); //FCP: First Contentful Paint
      getLCP(onPerfEntry); //LCP: Largest Contentful Paint
      getTTFB(onPerfEntry);//TTFB:  Time to First Byte
    });
  }
};

export default reportWebVitals;
