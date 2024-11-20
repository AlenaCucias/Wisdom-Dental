import { ChevronDown } from ".";

export default {
  title: "Components/ChevronDown",
  component: ChevronDown,
  argTypes: {
    size: {
      options: [
        "sixteen",
        "twenty-four",
        "forty-eight",
        "twenty",
        "thirty-two",
        "forty",
      ],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    size: "sixteen",
    className: {},
    img: "https://c.animaapp.com/khMdpB74/img/size-20@2x.png",
  },
};
