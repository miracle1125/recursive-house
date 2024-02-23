import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { ProgressBar } from '../ProgressBar';

const PageLoaderBar = () => {
  const [loadingRouter, setLoadingRouter] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const intervalRef = useRef<NodeJS.Timeout>();
  //Fake loader
  useEffect(() => {
    if (!loadingRouter) {
      setProgress(0);
    } else {
      let step = 0.005;
      let currentProgress = progress;
      intervalRef.current = setInterval(function () {
        currentProgress += step;
        const newProgress =
          Math.round(
            (Math.atan(currentProgress) / (Math.PI / 2)) * 100 * 1000,
          ) / 1000;
        setProgress(newProgress);
        if (newProgress >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else if (newProgress >= 50) {
          step = 0.05;
        }
      }, 20);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingRouter]);

  //Check if the route is changing
  useEffect(() => {
    const handleRouteChange = () => {
      setLoadingRouter(true);
    };
    const handleRouteComplete = () => {
      setLoadingRouter(false);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProgressBar
      progress={progress}
      className={cn(loadingRouter ? 'block' : 'hidden', '!fixed top-0 z-[99]')}
    />
  );
};

export default PageLoaderBar;
