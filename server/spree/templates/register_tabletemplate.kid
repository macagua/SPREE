<?python
from spree.register_widgets import FakeInputWidget
?>
<form xmlns:py="http://purl.org/kid/ns#"
        name="${name}"
        action="${action}"
        method="${method}"
        class="tableform"
        py:attrs="form_attrs"
        id = "regPersonalForm"
    >
    <div py:for="field in hidden_fields" 
        py:replace="field.display(value_for(field), **params_for(field))" 
    />
    <table py:attrs="table_attrs">
    <tbody>
        <tr py:for="i, field in enumerate(fields)" 
            class="${(i%2 and 'odd' or 'even') + (error_for(field) and ' fielderror' or ' ')}"
        >
            <th>
                <label py:if="not isinstance(field, FakeInputWidget)" class="fieldlabel" for="${field.field_id}" py:content="field.label" />
				<span py:if="isinstance(field, FakeInputWidget)" class="fieldlabel" py:content="field.label"/>
            </th>
            <td>
                <span py:replace="field.display(value_for(field), **params_for(field))" />
                
            </td>
            <td>
            	<span py:if="error_for(field)" class="fielderror" py:content="error_for(field)" />
                <span py:if="field.help_text and not field.is_validated" 
                        class="fieldhelp" py:content="field.help_text" />
            </td>
        </tr>
        <tr>
            <td>&#160;</td>
            <td>&#160;</td>
			<td>&#160;</td>
        </tr>
    </tbody>
    </table>
    <input type="hidden" value="${message}" id="inpmsg"/>
</form>