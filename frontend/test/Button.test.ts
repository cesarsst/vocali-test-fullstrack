import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "~/components/Button.vue";

describe("Button.vue", () => {
  it("renderiza o texto corretamente", () => {
    const wrapper = mount(Button, {
      props: { label: "Clique aqui" },
    });

    expect(wrapper.text()).toBe("Clique aqui");
  });

  it("emite evento de click", async () => {
    const wrapper = mount(Button, {
      props: { label: "Botão" },
    });

    await wrapper.trigger("click");

    expect(wrapper.emitted("click")).toHaveLength(1);
  });
});
