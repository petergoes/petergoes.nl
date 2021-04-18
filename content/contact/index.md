---
  title: Contact
  description: Get in touch! I like to hear from you
  layout: page
---
## Send me a message:

<form data-netlify="true" class="contact__form" name="contact-page" action="/contact/success" method="POST">
	<ol>
		<li class="contact__form__element">
			<label class="contact__form__label" for="input-name">Your name:</label>
			<input class="contact__form__input" id="input-name" type="text" name="name" required />
		</li>
		<li class="contact__form__element">
			<label class="contact__form__label" for="input-email">Your email:</label>
			<input class="contact__form__input" id="input-email" type="email" name="email" required />
		</li>
		<li class="contact__form__element">
			<label class="contact__form__label" for="input-message">Your message:</label>
			<textarea class="contact__form__input" id="input-message" name="message" rows="10" required></textarea>
		</li>
	</ol>
	<input type="hidden" name="confirmemail" />
	<button class="contact__form__submit">Submit</button>
</form>

Or reach out to me on the platforms listed in the footer.
