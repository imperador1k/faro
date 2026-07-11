import re

file_path = 'CLERK_EMAIL_TEMPLATES.md'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace body background (make it light mode premium e2e8f0 or f1f5f9)
content = content.replace('background-color="#f8fafc" padding="40px 16px"', 'background-color="#f1f5f9" padding="40px 20px"')
content = content.replace('background-color="#f8fafc" border-radius="0px"', 'background-color="#f1f5f9"')

# Update Card wrapping block (which is the first #ffffff block inside re-main)
content = re.sub(
    r'<re-block background-color="#ffffff" padding="0px" align="center">',
    '<re-block background-color="#ffffff" padding="0px" align="center" border-radius="24px" border="2px solid #e2e8f0" border-bottom="8px solid #cbd5e1" overflow="hidden">',
    content
)

# Thicken the top color bars for Gamified Look
content = content.replace('padding="6px 0px"', 'padding="8px 0px"')

# Make headings larger, darker and bolder
content = re.sub(
    r'<re-heading(.*?)font-size="26px"(.*?)color="#0f172a"(.*?)>',
    r'<re-heading\1font-size="32px"\2color="#1e293b" font-weight="bold"\3>',
    content
)
# Also catch cases where color is before font-size
content = re.sub(
    r'<re-heading(.*?)color="#0f172a"(.*?)font-size="26px"(.*?)>',
    r'<re-heading\1color="#1e293b" font-weight="bold"\2font-size="32px"\3>',
    content
)

# Improve body text spacing
content = content.replace('font-size="15px"', 'font-size="16px" line-height="24px"')

# Improve button styles to Gamified Bouncy Button
content = re.sub(
    r'<re-button (.*?) background-color="#58cc02" border-radius="16px" padding="16px 44px" align="center">',
    r'<re-button \1 background-color="#58cc02" border-radius="16px" border-bottom="5px solid #46a302" padding="18px 44px" align="center" font-size="18px" font-weight="bold" color="#ffffff">',
    content
)

# Enhance the OTP Code block (Verification / Password Reset)
content = re.sub(
    r'<re-block background-color="#f0fdf4" padding="24px 40px" align="center">',
    r'<re-block background-color="#f0f8e2" padding="32px 48px" align="center" border-radius="20px" border="2px solid #c7ebb1" border-bottom="6px solid #c7ebb1">',
    content
)
# Boost OTP text size
content = content.replace('font-size="40px"', 'font-size="48px" letter-spacing="4px"')

# Sub-text metadata improvements
content = content.replace('font-size="12px" color="#94a3b8"', 'font-size="13px" color="#94a3b8" font-weight="500"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully!")
