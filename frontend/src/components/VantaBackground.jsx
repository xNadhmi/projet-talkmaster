import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";

const VantaBackground = () => {
	const [vantaEffect, setVantaEffect] = useState(null);
	const vantaRef = useRef(null);

	useEffect(() => {
		if (!vantaEffect) {
			setVantaEffect(
				GLOBE({
					el: vantaRef.current,
					THREE,
					mouseControls: true,
					touchControls: true,
					gyroControls: false,
					minHeight: 200.00,
					minWidth: 200.00,
					backgroundAlpha: 1.00,
					backgroundColor: 0x23153c,
					color: 0xff3f6c,
					color2: 0xffffff,
					scale: 1.00,
					size: 1.00,
					maxDistance: 110,
					spacing: 50.00,
					mouseEase: 1.00,
				})
			);
		}

		return () => {
			if (vantaEffect) vantaEffect.destroy();
		};
	}, [vantaEffect]);

	return <div ref={vantaRef} className="vanta-container"></div>;
};

export default VantaBackground;
