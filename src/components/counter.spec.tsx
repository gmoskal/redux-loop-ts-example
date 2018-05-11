import * as React from "react"
import { renderComponent } from "../test"
import { CounterContainer } from "./counter"

describe("components/Counter", () =>
    it("renders", () => expect(renderComponent(<CounterContainer />)).toMatchSnapshot()))
