import Header from "../components/Header";

export default function PrivateLayout({ children }) {
	return (
		<>
			<Header />
			<main>{children}</main>
		</>
	);
}
