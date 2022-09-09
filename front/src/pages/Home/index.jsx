
import { Container, Brand, Menu} from "./styles"

import {Header} from "../../components/Header"

export function Home() {
    return (
        <Container>
            <Brand>
                <h1>MyChannel</h1>
            </Brand>

            <Header></Header>

            <Menu></Menu>
        </Container>
    )
}