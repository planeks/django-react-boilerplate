from jinja2 import Environment, BaseLoader


def jinja2_template_to_html(template, context):
    template = Environment(loader=BaseLoader).from_string(template)
    html_string = template.render(**context)
    return html_string.strip()
