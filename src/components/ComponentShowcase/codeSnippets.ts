export const codeSnippets: Record<string, string> = {
  ButtonDemo: `<Pressable hover="lift">
  <button>Get Started</button>
</Pressable>`,

  CardDemo: `<Card hover="lift">
  Card content
</Card>`,

  ToggleDemo: `<Toggle
  checked={isOn}
  onChange={setIsOn}
/>`,

  TabsDemo: `<AnimatedTabs
  tabs={["Overview", "Details", "Activity"]}
  active={activeTab}
  onSelect={setActiveTab}
/>`,

  MenuDemo: `<Collapse open={isOpen}>
  <Stagger>
    {items.map(item => (
      <MenuItem key={item}>{item}</MenuItem>
    ))}
  </Stagger>
</Collapse>`,

  AccordionDemo: `<Accordion items={[
  { title: "Question?", content: "Answer." },
  { title: "Another?", content: "Sure." },
]} />`,

  ToastDemo: `<Toast
  message="Changes saved"
  visible={show}
/>`,

  SkeletonDemo: `<Skeleton loaded={isDone}>
  <RealContent />
</Skeleton>`,

  ProgressDemo: `<ProgressBar value={75} />`,

  DragDemo: `<DragSlider />`,

  FormDemo: `<Shake trigger={hasError}>
  <input type="email" />
</Shake>`,

  TooltipDemo: `<Tooltip content="Bearings solutions">
  <span>Bearings</span>
</Tooltip>`,

  CounterDemo: `<Counter value={1234} />`,

  ChipDemo: `<ChipList
  items={["Bearings", "Seals", "Grease"]}
  onRemove={(chip) => remove(chip)}
/>`,

  ModalDemo: `<Modal
  open={isOpen}
  onClose={() => setOpen(false)}
>
  <h3>Dialog Title</h3>
  <p>Content here</p>
</Modal>`,

  BadgeDemo: `<Badge count={3}>
  <BellIcon />
</Badge>`,

  CopyDemo: `<CopyButton text={codeString} />`,

  SpinnerDemo: `<Spinner />`,
};
